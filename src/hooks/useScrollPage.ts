import { useState, useEffect } from 'react';

interface IUseScrollPage {
  x: number;
  y: number;
  screenY: number;
}

const useScrollPage = (
): IUseScrollPage => {
  const [state, setState] = useState({
    x: 0,
    y: 0,
    screenY: 0,
  });

  const onScroll = (event: Event) => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const screenY = scrollHeight - clientHeight;
    setState({
      x: Math.ceil(window.scrollX),
      y: Math.ceil(window.scrollY),
      screenY,
    });
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [])

  return state;
}

export default useScrollPage;
