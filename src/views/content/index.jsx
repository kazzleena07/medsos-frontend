import {
  Lucide,
} from "@/base-components";
import { useEffect, useRef, useState } from "react";
import CommonServices from "../../services/common";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader, Notification } from "../../base-components";


let userData = localStorage.getItem("userData")
function Main() {
  const navigate = useNavigate();
  const [contentList, setContentList] = useState([])
  const fileRef = useRef();
  const commentRef = useRef();
  const notifRef = useRef();
  const notifRefFailed = useRef();
  const [headerFooterModalPreview, setHeaderFooterModalPreview] = useState(false);

  let userDatass = JSON.parse(userData);
  const [file, setFile] = useState();
  const [fileParam, setFileParam] = useState();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("")
  const [comment, setComment] = useState("")

  function handleChange(e) {
    // console.log(e.target.files);
    setFileParam(e.target.files[0]);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  const fetchContent = async () => {
    let response = await CommonServices.callApi(true, "application/json", "content/list", "GET");
    if (response.error == 0) {
      setContentList(response.data);
    }
  }

  const RenderNotification = () => {
    return (
      <Notification getRef={(el) => {
        notifRef.current = el;
      }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Your content successfully uploaded</div>
        </div>
      </Notification>
    )
  }


  const RenderFailedNotification = () => {
    return (
      <Notification getRef={(el) => {
        notifRefFailed.current = el;
      }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Your content failed to upload</div>
        </div>
      </Notification>
    )
  }

  const postContent = async () => {
    let fileParams = fileParam;
    let titleParam = title;
    let descParam = desc;
    const formData = new FormData();
    if (fileParams)
      formData.append('contentImage', fileParams)
    if (titleParam)
      formData.append('title', titleParam)
    if (descParam)
      formData.append('description', descParam)

    formData.append('idUser', userDatass.id)
    let response = await CommonServices.callApi(true, "multipart/form-data", "content/create", "POST", formData);
    if (response.error == 0) {
      notifRef.current?.showToast();
      fetchContent();
      setHeaderFooterModalPreview(false);
    } else {
      notifRefFailed.current?.showToast();
    }
  }

  const onInputComment = async (idContent) => {
    let req = {
      "idUser": userDatass.id,
      "idContent": idContent,
      "comment": comment
    }
    let response = await CommonServices.callApi(true, "application/json", "content/comment", "POST", req);
    if (response.error == 0) {
      fetchContent();
      setComment("")
    }
  }

  const onLike = async (idContent) => {
    let req = {
      "idUser": userDatass.id,
      "idContent": idContent,
    }
    let response = await CommonServices.callApi(true, "application/json", "content/like", "POST", req);
    if (response.error == 0) {
      fetchContent();
    }
  }

  const moveToDetail = (idContent) => {
    navigate('/detail-content/' + idContent);
  }

  useEffect(() => {
    fetchContent();
  }, [])

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Content</h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
          <button onClick={() => { setHeaderFooterModalPreview(true) }} className="btn btn-primary shadow-md mr-2">
            Add New Post
          </button>
        </div>
      </div>
      <div className="intro-y grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: Blog Layout */}
        {contentList.map((item, index) => (
          <div

            key={index}
            className="intro-y col-span-12 md:col-span-6 xl:col-span-4 box cursor-pointer"
          >
            <div onClick={() => { moveToDetail(item.id) }}>
              <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                <div className="w-10 h-10 flex-none image-fit">
                  <img
                    alt="Midone Tailwind HTML Admin Template"
                    className="rounded-full"
                    src={item.profile.profilePicture}
                  />
                </div>
                <div className="ml-3 mr-auto">
                  <a href="" className="font-medium">
                    {item.profile.firstName + " " + item.profile.lastName}
                  </a>
                  <div className="flex text-slate-500 truncate text-xs mt-0.5">
                    {moment(item.createdAt).fromNow()}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="h-40 2xl:h-56 image-fit">
                  <img
                    alt="Midone Tailwind HTML Admin Template"
                    className="rounded-md"
                    src={item.photo}
                  />
                </div>
                <a href="" className="block font-medium text-base mt-5">
                  {item.title}
                </a>
                <div className="text-slate-600 dark:text-slate-500 mt-2" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
            <div className="px-5 pt-3 pb-5 border-t border-slate-200/60 dark:border-darkmode-400">
              <div className="w-full flex text-slate-500 text-xs sm:text-sm">
                <div className="mr-2">
                  Comments:{" "}
                  <span className="font-medium">{item.commentCount}</span>
                </div>
                <div className="ml-auto" style={{ display: 'flex', flexDirection: 'row' }}>
                  <a className="mr-1" onClick={() => { onLike(item.id) }}><Lucide className="w-5 h-5" icon="Heart"></Lucide></a>Likes:<span className="font-medium">{item.likeCount}</span>
                </div>
              </div>
              <div className="w-full flex items-center mt-3">
                <div className="flex-1 relative text-slate-600">
                  <input
                    type="text"
                    className="form-control form-control-rounded border-transparent bg-slate-100 pr-10"
                    placeholder="Post a comment..."
                    onChange={(e)=>{setComment(e.target.value)}}
                  />
                  <a onClick={() => { onInputComment(item.id) }}
                    className="w-4 h-5 absolute my-auto inset-y-0 mr-3" style={{ right: 20, color: 'blanchedalmond', fontWeight: '600' }}>Kirim</a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* END: Blog Layout */}
        {/* BEGIN: Pagination */}
        {/* <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
          <nav className="w-full sm:w-auto sm:mr-auto">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#">
                  <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  <Lucide icon="ChevronLeft" className="w-4 h-4" />
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  ...
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  ...
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  <Lucide icon="ChevronsRight" className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </nav>
          <select className="w-20 form-select box mt-3 sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </select>
        </div> */}

        <Modal
          show={headerFooterModalPreview}
          onHidden={() => {
            setHeaderFooterModalPreview(false);
          }}
        >
          <ModalHeader>
            <h2 className="font-medium text-base mr-auto">
              Post Your Content
            </h2>
          </ModalHeader>
          <ModalBody className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12">
              <div style={{ marginTop: 10, marginBottom: 30 }}>
                <label className="font-bold" >
                  Image Content
                </label>
                {file ? (
                  <img style={{ maxHeight: 300, marginTop: 10 }} src={file} />
                ) : (
                  <input style={{ marginTop: 10, paddingTop: 7, paddingBottom: 7, paddingLeft: 7 }} className="form-control" type="file" onChange={handleChange} />
                )}
              </div>

              <div style={{ marginTop: 10, marginBottom: 30 }}>
                <label className="form-label font-bold">
                  Title
                </label>
                <input
                  onChange={(e) => { setTitle(e.target.value) }}
                  style={{ marginTop: 10 }}
                  type="text"
                  className="form-control"
                  placeholder="Title..."
                />
              </div>

              <div style={{ marginTop: 10, marginBottom: 30 }}>
                <label className="form-label font-bold">
                  Description
                </label>
                <textarea
                  style={{ marginTop: 10 }}
                  onChange={(e) => { setDesc(e.target.value) }}
                  className="form-control"
                  rows={5}
                  cols={5}
                  placeholder="Description..."
                />
              </div>

            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              onClick={() => {
                setFile(null)
                setTitle("")
                setDesc("")
                setFileParam(null)
                setHeaderFooterModalPreview(false);
              }}
              className="btn btn-outline-secondary w-20 mr-1"
            >
              Cancel
            </button>
            <button onClick={postContent} type="button" className="btn btn-primary w-20">
              Post
            </button>
          </ModalFooter>
        </Modal>
        {/* END: Pagination */}
      </div>

      <RenderNotification />
      <RenderFailedNotification />
    </>
  );
}

export default Main;
