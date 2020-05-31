import React,{Fragment} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Moment from 'react-moment'
import {deleteComment} from '../../actions/post'
import PropTypes from 'prop-types'

const CommentItem = ({commentId,postId,auth,deleteComment,comment:{user,text,name,avatar,date}}) => {
    return (
        <div class="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${user}`}>
              <img
                class="round-img"
                src={avatar}
                alt=""
              />
              <h4>{name}</h4>
            </Link>
          </div>
          <div>
            <p class="my-1">
              {text}
            </p>
             <p class="post-date">
                Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
            </p>
            {
                !auth.loadind && user == auth.user._id &&
                <button onClick={()=>deleteComment(postId,commentId)}   
                    type="button"
                    class="btn btn-danger">
                    <i class="fas fa-times"></i>
                </button>
            }
        
          </div>
        </div>
    )
}

CommentItem.propTypes = {
    auth: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    postId:PropTypes.string.isRequired,
    commentId:PropTypes.string.isRequired,
    deleteComment:PropTypes.func.isRequired
}

const mapStateToProps= state=>({
    auth:state.auth
})
export default connect(mapStateToProps, {deleteComment})(CommentItem)