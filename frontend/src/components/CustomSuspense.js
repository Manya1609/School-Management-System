import React, { Suspense } from 'react';

const CustomSuspense = ({ children }) => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full transition-opacity duration-500 ease-in-out">Loading...</div>}>
            {children}
        </Suspense>
    );
};

export default CustomSuspense;