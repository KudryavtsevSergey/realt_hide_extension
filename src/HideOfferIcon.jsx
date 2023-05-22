import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import useChromeLocalStorage from './useChromeLocalStorage';

const HideOfferIcon = ({ block, href, offerId }) => {
  const [hideOffers, setHideOffers] = useState({});

  useEffect(() => {
    useChromeLocalStorage('hide-offers', {}).then(({ value }) => {
      setHideOffers(value);
    });
  }, [setHideOffers]);

  const hideOffer = useCallback(async () => {
    const { value, set } = await useChromeLocalStorage('hide-offers', {});
    value[offerId] = { href, createdAt: moment().format('YYYY-MM-DD HH:mm:ss') };
    await set(value);
    setHideOffers(value);
  }, [setHideOffers]);

  useEffect(() => {
    if (Object.keys(hideOffers).includes(offerId)) {
      block.style.display = 'none';
    } else {
      block.style.removeProperty('display');
    }
  }, [hideOffers, offerId]);

  return (
    <div className="md:ml-4 hide-offer">
      <div style={{ position: 'relative' }} className="mt-0">
        <button
          onClick={hideOffer}
          className="focus:outline-none sm:focus:shadow-10bottom cursor-pointer select-none block relative !border-none w-6 h-6 !bg-transparent z-[2] border-basic-200 hover:bg-basic-100 active:bg-basic-50 disabled:bg-basic-200 disabled:border-basic-200 disabled:text-basic-700 transition-colors border rounded-md"
          type="button">
          <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 459.313 459.314" xml:space="preserve">
          <g>
            <path d="M459.313,229.648c0,22.201-17.992,40.199-40.205,40.199H40.181c-11.094,0-21.14-4.498-28.416-11.774
              C4.495,250.808,0,240.76,0,229.66c-0.006-22.204,17.992-40.199,40.202-40.193h378.936
              C441.333,189.472,459.308,207.456,459.313,229.648z"/>
          </g>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default HideOfferIcon;
