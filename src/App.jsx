import useChromeLocalStorage from './useChromeLocalStorage';
import { useCallback, useEffect, useState } from 'react';

const App = () => {
  const [hideOffers, setHideOffers] = useState({});

  const remove = useCallback(async (offerId) => {
    const { value, set } = await useChromeLocalStorage('hide-offers', {});
    delete value[offerId];
    await set(value);
    setHideOffers(value);
  }, [setHideOffers]);

  const removeAll = useCallback(async () => {
    const { remove } = await useChromeLocalStorage('hide-offers', {});
    await remove();
    setHideOffers({});
  }, [setHideOffers]);

  useEffect(() => {
    useChromeLocalStorage('hide-offers', {}).then(({ value }) => {
      setHideOffers(value);
    });
  }, [setHideOffers]);

  return (
    <table>
      <thead>
      <tr>
        <th>Key</th>
        <th>Id</th>
        <th>Created</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      {Object.entries(hideOffers).map(([offerId, { href, createdAt }], key) => (
        <tr>
          <td>{key + 1}</td>
          <td><a href={href}>{offerId}</a></td>
          <td style={{ whiteSpace: 'nowrap' }}>{createdAt}</td>
          <td>
            <button onClick={() => remove(offerId)}>
              remove
            </button>
          </td>
        </tr>
      ))}
      {Object.keys(hideOffers).length > 0 && (
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>
            <button onClick={removeAll}>
              remove all
            </button>
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
};

export default App;
