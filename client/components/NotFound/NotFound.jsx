import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="">
      <span className="">Page not found</span>
      <Link href="/">
          Nhấn để trở về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;