import React from 'react';
import { createRoot } from 'react-dom/client';
import HideOfferIcon from './HideOfferIcon';
import debounce from 'lodash.debounce';

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

const render = () => {
  console.log(1);
  const favorites = document.querySelectorAll(`[id^="favorite"]`);

  favorites.forEach((favorite) => {
    const wrap = favorite.parentNode.parentNode.parentNode.parentNode.parentNode;
    const href = wrap.querySelector('a').href;
    const offerId = href.match(/\d/g).join('');
    const block = wrap.parentNode;

    const rootId = `root-${offerId}`;

    let root = document.querySelector(`#${rootId}`);
    if (!root) {
      root = document.createElement('div');
      root.id = rootId;

      insertAfter(root, favorite.parentNode.parentNode);
    }

    createRoot(root).render(
      <React.StrictMode>
        <HideOfferIcon block={block} offerId={offerId} href={href} />
      </React.StrictMode>,
    );
  });
};

const debounceRender = debounce(render, 2000);

debounceRender();

const holder = document.querySelector('#holder');
holder.addEventListener('DOMSubtreeModified', debounceRender, false);
const pages = document.querySelector('.empty\\:hidden');
pages.addEventListener('DOMSubtreeModified', debounceRender, false);
