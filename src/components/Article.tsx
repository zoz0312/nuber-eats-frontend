import React from 'react';
import { Helmet } from 'react-helmet-async';

interface IArticleProps {
  title: string;
  loading: boolean;
}

const Article: React.FC<IArticleProps> = ({
  children,
  title,
  loading,
}) => {
  return (
    <>
      <Helmet>
        {`${title} | Nuber Eats`}
      </Helmet>
      { loading ? (
        <div className="mt-20 text-center text-4xl text-lime-600">Loading...</div>
      ) : (
        <article className="common-article">
          { children }
        </article>
      )}
    </>
  );
}

export default Article;
