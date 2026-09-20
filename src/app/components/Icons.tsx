import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { name: string };

const paths: Record<string, React.ReactNode> = {
  heart: <path d="M12 20s-7-4.35-9.5-8.5C.9 8.5 2.2 5 5.5 5 7.6 5 9 6.5 12 9c3-2.5 4.4-4 6.5-4C21.8 5 23.1 8.5 21.5 11.5 19 15.65 12 20 12 20Z" />,
  hands: (
    <>
      <path d="M12 13c1.8-2 3-3.2 4.2-3.2 1 0 1.5.8 1.5 1.6 0 2.4-2.8 5.2-5.7 6.6" />
      <path d="M12 13c-1.8-2-3-3.2-4.2-3.2-1 0-1.5.8-1.5 1.6 0 2.4 2.8 5.2 5.7 6.6" />
      <path d="M12 8.5C12 6 13.3 4 15 4M12 8.5C12 6 10.7 4 9 4" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8 15.8 6.3M8.2 13.2l7.6 4.5" />
    </>
  ),
  soup: (
    <>
      <path d="M4 11h16a8 8 0 0 1-16 0Z" />
      <path d="M6 20h12" />
      <path d="M9 7c0-1 1-1.5 1-2.5S9 3 9 3M13 7c0-1 1-1.5 1-2.5S13 3 13 3" />
    </>
  ),
  box: (
    <>
      <path d="M3.5 8 12 4l8.5 4v8L12 20l-8.5-4V8Z" />
      <path d="M3.5 8 12 12l8.5-4M12 12v8" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="4" rx="1" />
      <path d="M5 13v7h14v-7M12 9v11" />
      <path d="M12 9C10 9 7.5 8.5 7.5 6.5S9.5 4 12 9c2.5-5 4.5-2.5 4.5-.5S14 9 12 9Z" />
    </>
  ),
  elder: (
    <>
      <circle cx="10" cy="5.5" r="2.5" />
      <path d="M10 8.5c-2.2 0-3.5 1.5-3.5 4V20M6.5 12.5H10M14 20V8l3 2v10M14 12l3-1" />
    </>
  ),
  water: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 17H9l-4.5 3.5V17A1.5 1.5 0 0 1 3 15.5v-9A1.5 1.5 0 0 1 4.5 5Z" />
      <path d="M8 10h8M8 13h5" />
    </>
  ),
  sound: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M17 9.5l4 5M21 9.5l-4 5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5c.7 0 1.3.5 1.5 1.2l.9 3a1.6 1.6 0 0 1-.5 1.7L7 10.6a12 12 0 0 0 5.4 5.4l1.2-1.4a1.6 1.6 0 0 1 1.7-.5l3 .9c.7.2 1.2.8 1.2 1.5v2.4c0 1-.8 1.7-1.8 1.6C10.7 20 4 13.3 3.5 5.3 3.4 4.3 4.2 3.5 5.2 3.5h1.3Z" />
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Z" />
      <path d="M9 9.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.5c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6.3.5.8 1.1 1.4 1.5.5.3.7.3.9.1l.5-.5c.2-.2.4-.2.6-.1l1.4.7c.2.1.4.3.4.5 0 .8-.6 1.5-1.3 1.6-.6.1-1.3.2-3-.6-2.2-1-3.6-3.3-3.7-3.5-.1-.2-.9-1.2-.9-2.3 0-1 .5-1.5.7-1.6Z" fill="currentColor" stroke="none" />
    </>
  ),
  link: (
    <>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M8 12l-1.5 1.5a3 3 0 0 0 4.2 4.2L12.5 16M16 12l1.5-1.5a3 3 0 0 0-4.2-4.2L11.5 8" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  mapPin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.5" />
      <rect x="13.5" y="11" width="7" height="9.5" rx="1.5" />
      <rect x="3.5" y="13" width="7" height="7.5" rx="1.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5M17 15c2.3.4 4 2.3 4 5" />
    </>
  ),
  euro: (
    <>
      <path d="M16 7.5A5.5 5.5 0 0 0 7 12a5.5 5.5 0 0 0 9 4.5" />
      <path d="M4.5 10.5H12M4.5 13.5H11" />
    </>
  ),
  inbox: (
    <>
      <path d="M3.5 13 6 5.5A2 2 0 0 1 7.9 4h8.2A2 2 0 0 1 18 5.5L20.5 13v5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-5Z" />
      <path d="M3.5 13H8a2 2 0 0 0 4 0 2 2 0 0 0 4 0h4.5" />
    </>
  ),
  handHeart: (
    <>
      <path d="M11.5 8.2c1.3-1.6 3.9-1 3.9 1 0 1.7-2.4 3.4-3.9 4.3-1.5-.9-3.9-2.6-3.9-4.3 0-2 2.6-2.6 3.9-1Z" />
      <path d="M3.5 14l3-1.5c.6-.3 1.3-.2 1.8.2l2 1.6c.5.4.5 1.1.1 1.5-.4.4-1 .5-1.5.2L7 15M3.5 14v6M20.5 15l-4.5 4-4 1.5-4-1.5" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H7l1 4h2l-1-4 9 3.5V6L9 9.5H5.5A1.5 1.5 0 0 0 4 11Z" />
      <path d="M18 9a3 3 0 0 1 0 6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" />
    </>
  ),
  logout: (
    <>
      <path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15" />
      <path d="M12 12h9M18 8.5l3.5 3.5L18 15.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  edit: (
    <>
      <path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17v3Z" />
      <path d="M14.5 8 17 10.5" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M6.5 7l1 12A1.5 1.5 0 0 0 9 20.5h6a1.5 1.5 0 0 0 1.5-1.5l1-12" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11M8 11l4 4 4-4" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  check: <path d="M5 12.5 10 17.5 19.5 7" />,
  star_o: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />,
  filter: <path d="M4 6h16l-6 7v5l-4 2v-7L4 6Z" />,
  reply: <path d="M9 8 4 13l5 5M4 13h9a7 7 0 0 1 7 7v-1" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  archive: (
    <>
      <rect x="3.5" y="4.5" width="17" height="4" rx="1" />
      <path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5M10 12h4" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  bank: (
    <>
      <path d="M4 9.5 12 4l8 5.5M5 9.5h14M6 10v7M10 10v7M14 10v7M18 10v7M4 20h16" />
    </>
  ),
  sparkle: <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />,
  trend: <path d="M4 16l5-5 3 3 7-8M15 6h5v5" />,
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3V3.5Z" />
      <path d="M9 8h6M9 11.5h6M9 15h4" />
    </>
  ),
};

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={props.width ?? 24}
      height={props.height ?? 24}
      aria-hidden="true"
      {...props}
    >
      {paths[name] ?? paths.heart}
    </svg>
  );
}

export default Icon;
