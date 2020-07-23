import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/cjs/Skeleton';
import { Spinner } from '@redhat-cloud-services/frontend-components/components/cjs/Spinner';
import { TableVariant } from '@patternfly/react-table';
import { PageHeader, PageLayout } from '../pageLayout/pageLayout';
// import { TableSkeleton } from './tableSkeleton';
import { TableSkeleton } from '../table/tableSkeleton';

/**
 * Render skeleton and spinner loaders.
 *
 * @param {object} props
 * @param {string} props.skeletonProps
 * @param {object} props.tableProps
 * @param {string} props.variant
 * @returns {Node}
 */
const Loader = ({ skeletonProps, tableProps, variant }) => {
  switch (variant) {
    case 'chart':
    case 'graph':
      return (
        <div className="curiosity-skeleton-container curiosity-skeleton-container-chart">
          <Skeleton size={SkeletonSize.lg} />
          <Skeleton size={SkeletonSize.md} />
        </div>
      );
    case 'paragraph':
      return (
        <div className="curiosity-skeleton-container">
          <Skeleton size={SkeletonSize.xs} />
          <Skeleton size={SkeletonSize.sm} />
          <Skeleton size={SkeletonSize.md} />
          <Skeleton size={SkeletonSize.lg} />
        </div>
      );
    case 'skeleton':
      return <Skeleton {...skeletonProps} />;
    case 'table':
      return <TableSkeleton {...tableProps} />;
    case 'title':
      return (
        <PageLayout>
          <PageHeader>
            <Skeleton size="sm" />
          </PageHeader>
        </PageLayout>
      );
    case 'spinner':
    default:
      return <Spinner />;
  }
};

/**
 * Prop types.
 *
 * @type {{variant: string, tableProps}}
 */
Loader.propTypes = {
  skeletonProps: PropTypes.shape({
    size: PropTypes.oneOf([...Object.values(SkeletonSize)])
  }),
  tableProps: PropTypes.shape({
    borders: PropTypes.bool,
    className: PropTypes.string,
    colCount: PropTypes.number,
    rowCount: PropTypes.number,
    variant: PropTypes.oneOf([...Object.values(TableVariant)])
  }),
  variant: PropTypes.oneOf(['chart', 'graph', 'paragraph', 'skeleton', 'spinner', 'table', 'title'])
};

/**
 * Default props.
 *
 * @type {{variant: string}}
 */
Loader.defaultProps = {
  skeletonProps: {
    size: SkeletonSize.sm
  },
  tableProps: {},
  variant: 'spinner'
};

export { Loader as default, Loader };
