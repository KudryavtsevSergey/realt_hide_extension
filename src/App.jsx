import useChromeLocalStorage from './useChromeLocalStorage';
import { useCallback, useEffect, useState } from 'react';
import SortIcon from './SortIcon';

const App = () => {
  const [hideOffers, setHideOffers] = useState([]);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [direction, setDirection] = useState(false);

  const generateList = useCallback((items) => {
    const data = Object.entries(items).map(([offerId, { href, createdAt }]) => ({
      offerId: Number.parseInt(offerId),
      href,
      createdAt,
    }));

    data.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return direction ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return !direction ? -1 : 1;
      }
      return 0;
    });

    setHideOffers(data);
  }, [setHideOffers, orderBy, direction]);

  const changeOrder = useCallback(async (key) => {
    const { value } = await useChromeLocalStorage('hide-offers', {});

    if (orderBy !== key) {
      setOrderBy(key);
      setDirection(true);
    } else {
      setDirection(!direction);
    }

    generateList(value);
  }, [hideOffers, setHideOffers, orderBy, setOrderBy, direction, setDirection]);

  const remove = useCallback(async (offerId) => {
    const { value, set } = await useChromeLocalStorage('hide-offers', {});
    delete value[offerId];
    await set(value);
    generateList(value);
  }, [generateList]);

  const removeAll = useCallback(async () => {
    const { remove } = await useChromeLocalStorage('hide-offers', {});
    await remove();
    generateList({});
  }, [generateList]);

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
      generateList(data);
    };
  }, [generateList]);

  useEffect(() => {
    useChromeLocalStorage('hide-offers', {}).then(({ value }) => {
      generateList(value);
    });
  }, [generateList]);

  return (
    <table>
      <thead>
      <tr>
        <th>Key</th>
        <th onClick={() => changeOrder('offerId')}>
          Id
          {orderBy === 'offerId' && (<SortIcon value={direction} />)}
        </th>
        <th onClick={() => changeOrder('createdAt')}>
          Created
          {orderBy === 'createdAt' && (<SortIcon value={direction} />)}
        </th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      {hideOffers.map(({ offerId, href, createdAt }, key) => (
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
