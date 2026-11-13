import "./ShopAssistantLoading.css";

export function ShopAssistantLoading() {
  return <div className="shop-chat-loading" role="status">
    <span className="shop-chat-loading-label">Loading shopping chat…</span>
    <div className="shop-chat-skeleton" aria-hidden="true">
      <div className="shop-chat-skeleton-intro">
        <span className="shop-chat-skeleton-shape shop-chat-skeleton-avatar" />
        <span className="shop-chat-skeleton-shape shop-chat-skeleton-title" />
        <span className="shop-chat-skeleton-shape shop-chat-skeleton-subtitle" />
      </div>
      <div className="shop-chat-skeleton-messages">
        <div className="shop-chat-skeleton-bubble">
          <span className="shop-chat-skeleton-shape" />
          <span className="shop-chat-skeleton-shape" />
        </div>
        <div className="shop-chat-skeleton-bubble shop-chat-skeleton-customer">
          <span className="shop-chat-skeleton-shape" />
        </div>
        <div className="shop-chat-skeleton-bubble">
          <span className="shop-chat-skeleton-shape" />
          <span className="shop-chat-skeleton-shape" />
        </div>
      </div>
      <div className="shop-chat-skeleton-composer">
        <span className="shop-chat-skeleton-shape shop-chat-skeleton-input" />
        <span className="shop-chat-skeleton-shape shop-chat-skeleton-send" />
      </div>
    </div>
  </div>;
}
