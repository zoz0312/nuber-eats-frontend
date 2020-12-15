import React from 'react';
import Loading from './Loading';

interface IArticleProps {
  loading: boolean;
  className?: string;
}

const Article: React.FC<IArticleProps> = ({
  children,
  loading,
  className,
}) => {
  return (
    <>
      { loading ? (
        <Loading />
      ) : (
        <article className={`common-article ${className}`}>
          { children }
        </article>
      )}
    </>
  );
}

export default Article;
