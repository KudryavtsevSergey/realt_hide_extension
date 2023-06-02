import React from 'react';
import { createRoot } from 'react-dom/client';
import HideOfferIcon from './HideOfferIcon';

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

const render = () => {
  const favorites = document.querySelectorAll(`[id^="favorite"]`);

  favorites.forEach((favorite) => {
    const wrap = favorite.parentNode.parentNode.parentNode.parentNode.parentNode;
    const href = wrap.querySelector('a').href;
    const offerId = href.match(/\d/g).join('');
    const block = wrap.parentNode;

    const rootId = `root-${offerId}`;

    if (!document.querySelector(`#${rootId}`)) {
      const root = document.createElement('div');
      root.id = rootId;

      insertAfter(root, favorite.parentNode.parentNode);

      createRoot(root).render(
        <React.StrictMode>
          <HideOfferIcon block={block} offerId={offerId} href={href} />
        </React.StrictMode>,
      );
    }
  });
};

setInterval(render, 3000);
