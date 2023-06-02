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

  const exportAll = useCallback(async () => {
    const { value } = await useChromeLocalStorage('hide-offers', {});

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(value))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';
    link.click();
  }, []);

  const importAll = useCallback(({ target }) => {
    if (!target.files) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(target.files[0], 'UTF-8');
    fileReader.onload = async ({ target }) => {
      if (!target.result) {
        return;
      }
      const data = JSON.parse(target.result);
      const { set } = await useChromeLocalStorage('hide-offers', {});
      await set(data);
      setHideOffers(data);
    };
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
      <tr>
        <td>
          <button onClick={exportAll}>
            export
          </button>
        </td>
        <td colSpan={2}>
          <input type="file" onChange={importAll} />
        </td>
        <td>
          <button onClick={removeAll}>
            remove&nbsp;all
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  );
};

export default App;
