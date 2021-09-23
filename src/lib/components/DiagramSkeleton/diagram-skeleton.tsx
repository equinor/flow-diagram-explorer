import React from "react";
import ContentLoader from "react-content-loader";

import "./diagram-skeleton.css";

export const DiagramSkeleton = (): JSX.Element => (
    <div className="FlowDiagramExplorer__DiagramSkeleton">
        <ContentLoader
            speed={2}
            width={500}
            height={500}
            viewBox="0 0 500 500"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="8" y="196" rx="0" ry="0" width="168" height="94" />
            <rect x="304" y="37" rx="0" ry="0" width="168" height="94" />
            <rect x="304" y="196" rx="0" ry="0" width="168" height="94" />
            <rect x="303" y="356" rx="0" ry="0" width="168" height="94" />
            <rect x="175" y="244" rx="0" ry="0" width="129" height="2" />
            <rect x="247" y="82" rx="0" ry="0" width="2" height="321" />
            <rect x="249" y="82" rx="0" ry="0" width="59" height="2" />
            <rect x="248" y="402" rx="0" ry="0" width="59" height="2" />
        </ContentLoader>
    </div>
);
