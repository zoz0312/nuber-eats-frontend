import React from 'react';

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
        <div className="mt-20 text-center text-4xl text-lime-600">Loading...</div>
      ) : (
        <article className={`common-article ${className}`}>
          { children }
        </article>
      )}
    </>
  );
}

export default Article;
