import { ListInfo } from './GFxList';
import SvgSoket from '../../components/SvgSoket';

interface PropType {
  list: ListInfo[];
  selMenu: string;
  showUpdatePopup(b: boolean, item: ListInfo): void;
  showDelPopup(b: boolean, item: ListInfo): void;
}

const UiItem = (props: PropType) => {
  const { list, selMenu, showUpdatePopup, showDelPopup } = props;

  /*
    const db = getDatabase();

    set(ref(db, 'ui/' + item.fla), {
      api: 'api change 6',
      fla: item.fla,
      member: item.member,
      subject: item.subject,
    })
      .then(() => {
        // changeList();
      })
      .catch();
      */

  list.sort((a, b) => {
    let sortA = a.subject.toUpperCase();
    let sortB = b.subject.toUpperCase();

    if (selMenu == 'fla') {
      sortA = a.fla.toUpperCase();
      sortB = b.fla.toUpperCase();
    } else if (selMenu == 'member') {
      sortA = a.member.toUpperCase();
      sortB = b.member.toUpperCase();
    } else if (selMenu == 'api') {
      sortA = a.api.toUpperCase();
      sortB = b.api.toUpperCase();
    }

    if (sortA < sortB) {
      return -1;
    }
    if (sortA > sortB) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      {list.map((item: ListInfo, index: number) => (
        <ul key={index} className="flex text-blue-900 bg-slate-200 h-8">
          <li className="flex-1 text-center">{item.subject}</li>
          <li className="flex-1 text-center">{item.fla}</li>
          <li className="flex-initial w-32 text-center">{item.member}</li>
          <li className="flex-1 text-center">
            <button>{item.api}</button>
          </li>
          <li className="flex-initial w-16 text-center ">
            <button
              className="h-full"
              onClick={() => {
                showUpdatePopup(true, item);
              }}
            >
              <SvgSoket
                width={'16'}
                height={'16'}
                viewBox={'-2 -2 27 27'}
                d={
                  'M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z'
                }
                fill="#000"
              />
            </button>
            <button
              className="ml-2 h-full"
              onClick={() => {
                showDelPopup(true, item);
              }}
            >
              <SvgSoket
                width={'16'}
                height={'16'}
                viewBox={'-2 -2 27 27'}
                d={
                  'M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z'
                }
                fill="#000"
              />
            </button>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default UiItem;
