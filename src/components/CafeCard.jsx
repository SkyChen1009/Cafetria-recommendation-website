import React from 'react';

export default function CafeCard({ cafe, onClick, isSelected }) {
  // 顯示最多三個評論
  const topReviews = cafe.reviews ? cafe.reviews.slice(0, 3) : [];
  
  return (
    <div 
      className={`glass-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
        background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
        boxShadow: isSelected ? '0 8px 32px rgba(245, 158, 11, 0.2)' : 'none'
      }}
    >
      <div className="card-header">
        <h2 className="cafe-name">{cafe.name}</h2>
        <div className="cafe-rating">
          <span className="star-rating">★</span> {cafe.rating || '無評分'} 
          <span className="review-count">({cafe.user_ratings_total || 0} 則評論)</span>
        </div>
      </div>
      
      {cafe.editorial_summary && (
        <p className="cafe-overview">{cafe.editorial_summary.overview}</p>
      )}

      <div className="cafe-links" onClick={(e) => e.stopPropagation()}>
        {cafe.url && <a href={cafe.url} target="_blank" rel="noreferrer">📍 Google Map</a>}
        {cafe.website && <a href={cafe.website} target="_blank" rel="noreferrer">🌐 官方網站</a>}
      </div>

      {topReviews.length > 0 && (
        <div className="reviews-section">
          <h3 className="reviews-title">最多人認同的評論</h3>
          <div className="reviews-list">
            {topReviews.map((review, i) => (
              <div key={i} className="review-item">
                <div className="review-author">{review.author_name}</div>
                <div className="review-text">"{review.text}"</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
