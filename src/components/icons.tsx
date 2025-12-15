import type { FC } from 'react';

type IconProps = {
  className?: string;
};

export const TableIcon: FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18" />
    <rect width="18" height="4" x="3" y="3" rx="1" />
    <path d="M21 7H3" />
    <path d="M21 12H3" />
    <path d="M21 17H3" />
  </svg>
);

export const DeskIcon: FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="6" x="2" y="4" rx="1" />
    <path d="M4 10v10" />
    <path d="M20 10v10" />
    <path d="M4 15h16" />
  </svg>
);

export const AlmirahIcon: FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <path d="M12 2v20" />
    <path d="M12 7h1" />
    <path d="M12 15h1" />
  </svg>
);
