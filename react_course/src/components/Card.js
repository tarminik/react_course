import React, { useState } from 'react';
import './Card.css'; // Создайте этот файл для стилизации компонента по своему желанию

function Card({ data }) {
  const [likes, setLikes] = useState(data.currentLikes);
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="card">
      <h3>{data.title}</h3>
      <p>{data.text}</p>
      <div>
        <span>Likes: {likes}</span>
        <button onClick={toggleLike}>
          {liked ? 'Unlike' : 'Like'}
        </button>
      </div>
    </div>
  );
}

export default Card;
