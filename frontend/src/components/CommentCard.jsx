import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { commentsAPI } from '../services/api';
import { formatRelativeDate } from '../utils/formatDate';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

const CommentCard = ({ comment, onDelete, onUpdate, onReplyClick }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isOwner = user && comment.user?._id === user._id;
  const authorName = comment.user?.name || 'Unknown';
  const avatarInitial = authorName.charAt(0).toUpperCase();

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    try {
      setEditLoading(true);
      const res = await commentsAPI.update(comment._id, { content: editContent.trim() });
      onUpdate(res.data.data.comment);
      setIsEditing(false);
      toast.success('Comment updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update comment');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await commentsAPI.delete(comment._id);
      onDelete(comment._id);
      toast.success('Comment deleted');
      setDeleteModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex gap-3 group animate-fade-in">
        {/* Avatar */}
        {comment.user?.avatar ? (
          <img
            src={comment.user.avatar}
            alt={authorName}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-sm mt-0.5"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
            {avatarInitial}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-semibold text-slate-800 text-sm">{authorName}</span>
            <span className="text-slate-400 text-xs">{formatRelativeDate(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-slate-400 text-xs italic">(edited)</span>
            )}

            {/* Owner actions */}
            {isOwner && !isEditing && (
              <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  aria-label="Edit comment"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteModal(true)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete comment"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Content or Edit form */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="input-field resize-none text-sm"
                rows={3}
                maxLength={1000}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={editLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-slate-700 text-sm leading-relaxed">{comment.content}</p>
              {user && !comment.parentComment && (
                <button
                  type="button"
                  onClick={onReplyClick}
                  className="text-xs text-slate-500 hover:text-primary-600 font-semibold mt-1.5 transition-colors"
                >
                  Reply
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete comment?"
        message="This comment will be permanently removed."
        confirmLabel="Delete"
      />
    </>
  );
};

export default CommentCard;
