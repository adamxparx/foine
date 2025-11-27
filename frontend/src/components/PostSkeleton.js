import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="mb-6 break-inside-avoid">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden animate-pulse">
        {/* Image skeleton */}
        <div className="relative">
          <div className="w-full h-64 bg-gray-700"></div>
        </div>

        {/* Content skeleton */}
        <div className="p-4">
          {/* Title skeleton */}
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-3/4 mb-3"></div>

          {/* User info skeleton */}
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-3 bg-gray-700 rounded w-20"></div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-700 rounded-lg flex-1"></div>
            <div className="h-8 bg-gray-700 rounded-lg flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;