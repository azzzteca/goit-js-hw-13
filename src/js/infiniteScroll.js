import { onLoadMore } from './axiosApi';

export function infiniteScroll() {
  window.addEventListener('scroll', () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight > scrollHeight - 10) {
      onLoadMore();
    }
  });
}
