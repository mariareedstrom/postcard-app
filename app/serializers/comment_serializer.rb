class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :user, :postcard, :created_at
  has_one :user
  has_one :postcard

end
