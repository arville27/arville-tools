import Link from "next/link";

type Props = {
  title: string;
  href: string;
  icon: null | JSX.Element;
};

const SidebarItem: React.FC<Props> = ({ title, href, icon }) => {
  return (
    <li>
      <Link href={href}>
        <div className="btn btn-ghost flex items-center justify-start rounded-lg p-2 text-base font-normal normal-case">
          {icon}
          <span className="ml-6 whitespace-nowrap">{title}</span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
