import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {getPost} from '../../actions/post'
import Spinner from '../layout/spinner'
import PostItem from '../posts/PostItem'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
const Post = ({getPost,post:{loading,post},showActions,match}) => {
    useEffect(() => {
        getPost(match.params.id)
    }, [getPost,match.params.id])
    return (
        <Fragment>
            {
                loading || post===null? <Spinner/>:
                <Fragment>
                    <Link to="/posts" className="btn btn-light">Back To Posts</Link>
                    <PostItem showActions={false} post={post}/>
                    <CommentForm postId={post._id}/>
                    <div className="comments">
                        {post.comments.map(comment => (
                            <CommentItem key = {comment._id} comment = {comment} commentId={comment._id} postId = {post._id}/>
                        ))}
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

Post.propTypes = {
    getPost:PropTypes.func.isRequired,
    post:PropTypes.object.isRequired,
    showActions:PropTypes.bool.isRequired
}
const mapStateToProps= state=>({
    post:state.post
})

export default connect(mapStateToProps,{getPost})(Post)
