import React from 'react';
import { Link } from 'react-router-dom';

const Tag = ({ tag, size = 'sm', clickable = true }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full font-medium transition-colors";

  const sizeClasses = {
    xs: "text-xs px-1.5 py-0.5",
    sm: "text-xs",
    md: "text-sm px-3 py-1.5"
  };

  const classes = `${baseClasses} ${sizeClasses[size]} bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-500/50`;

  if (clickable) {
    return (
      <Link
        to={`/tag/${encodeURIComponent(tag.tagName)}`}
        className={classes}
        onClick={(e) => e.stopPropagation()}
      >
        #{tag.tagName}
      </Link>
    );
  }

  return (
    <span className={classes}>
      #{tag.tagName}
    </span>
  );
};

export default Tag;