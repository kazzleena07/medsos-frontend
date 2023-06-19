import { Lucide, Tippy } from "@/base-components";
import { faker as $f } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import CommonServices from "../../services/common";
import moment from "moment";


let userData = localStorage.getItem("userData")
function Main() {

    let userDatass = JSON.parse(userData);
    const navigate = useNavigate();
    const params = useParams();
    const [detailContent, setDetailContent] = useState({});
    const [commentList, setCommentList] = useState([]);
    const commentRef = useRef();
    const [comment, setComment] = useState('')

    const fetchDetailContent = async () => {
        const response = await CommonServices.callApi(true, "application/json", "content/detail?id=" + params.id, "GET");
        if (response.error === 0) {
            setDetailContent(response.data.content);
            setCommentList(response.data.comment);
        }
    }

    const onInputComment = async () => {
        let req = {
            "idUser": userDatass.id,
            "idContent": params.id,
            "comment": comment
        }
        let response = await CommonServices.callApi(true, "application/json", "content/comment", "POST", req);
        if (response.error == 0) {
            fetchDetailContent();
            commentRef.current.value = ""
        }
    }

    const onLike = async () => {
        let req = {
            "idUser": userDatass.id,
            "idContent": params.id,
        }
        let response = await CommonServices.callApi(true, "application/json", "content/like", "POST", req);
        if (response.error == 0) {
            fetchDetailContent();
        }
    }

    useEffect(() => {
        fetchDetailContent();
    }, [])

    return (
        <>
            <div className="intro-y news p-5 box mt-8">
                {/* BEGIN: Blog Layout */}
                <button onClick={() => {
                    navigate(-1)
                }} className="btn btn-info mr-1 mb-5">
                    <Lucide icon="ChevronLeft" className="w-5 h-5" />
                </button>
                <h2 className="intro-y font-medium text-xl sm:text-2xl">
                    {detailContent.title}
                </h2>
                <div className="intro-y text-slate-600 dark:text-slate-500 mt-3 text-xs sm:text-sm">
                    {moment(detailContent.createdAt).format('DD MMMM YYYY')}
                    <span className="mx-1">•</span> {moment(detailContent.createdAt).fromNow()}
                </div>
                <div className="intro-y mt-6 ">
                    <div className="news__preview image-fit">
                        <img
                            className="rounded-md"
                            src={detailContent.photo}
                        />
                    </div>
                </div>
                <div className="intro-y flex relative pt-16 sm:pt-6 items-center pb-6">
                    <div className="absolute sm:relative -mt-12 sm:mt-0 w-full flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm">
                        <div className="intro-x mr-1 sm:mr-3">
                            Comments:
                            <span className="font-medium">{detailContent.commentCount}</span>
                        </div>
                        <div className="intro-x sm:mr-3 ml-auto" style={{ display: 'flex', flexDirection: 'row' }}>
                            <a className="mr-1 cursor-pointer" onClick={() => { onLike() }}><Lucide className="w-5 h-5" icon="Heart"></Lucide></a>  Likes: <span className="font-medium">{detailContent.likeCount}</span>
                        </div>
                    </div>
                </div>
                <div className="intro-y text-justify leading-relaxed">
                    <p className="mb-5">{detailContent.description}</p>
                </div>
                <div className="intro-y flex text-xs sm:text-sm flex-col sm:flex-row items-center mt-5 pt-5 border-t border-slate-200/60 dark:border-darkmode-400">
                    <div className="flex items-center">
                        <div className="w-12 h-12 flex-none image-fit">
                            <img
                                className="rounded-full"
                                src={detailContent.profile?.profilePicture}
                            />
                        </div>
                        <div className="ml-3 mr-auto">
                            <a href="" className="font-medium">
                                {detailContent.profile?.firstName + " " + detailContent.profile?.lastName}
                            </a>
                        </div>
                    </div>
                </div>
                {/* END: Blog Layout */}
                {/* BEGIN: Comments */}
                <div className="intro-y mt-5 pt-5 border-t border-slate-200/60 dark:border-darkmode-400">
                    <div className="news__input relative mt-5">
                        <Lucide
                            icon="MessageCircle"
                            className="w-5 h-5 absolute my-auto inset-y-0 ml-6 left-0 text-slate-500"
                        />
                        <textarea
                            className="form-control border-transparent bg-slate-100 pl-16 py-6 resize-none"
                            rows="1"
                            onChange={(e)=>{setComment(e.target.value)}}
                            placeholder="Post a comment..."
                        ></textarea>
                        <a onClick={() => { onInputComment() }}
                            className="w-4 h-5 absolute my-auto inset-y-0 mr-3 cursor-pointer" style={{ right: 20, color: 'blanchedalmond', fontWeight: '600' }}>Kirim</a>
                    </div>
                </div>
                <div className="intro-y mt-5 pb-10">
                    {commentList.length > 0 ? (
                        commentList.map((item, index) => (
                            <div key={index} className="mt-5 pt-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                <div className="flex">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit">
                                        <img
                                            className="rounded-full"
                                            src={item.profile.profilePicture}
                                        />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center">
                                            <a href="" className="font-medium">
                                                {item.profile.firstName + " " + item.profile.lastName}
                                            </a>
                                        </div>
                                        <div className="text-slate-500 text-xs sm:text-sm">
                                            {moment(item.createdAt).fromNow()}
                                        </div>
                                        <div className="mt-2">{item.comment}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                </div>
                {/* END: Comments */}
            </div>
        </>
    );
}

export default Main;
