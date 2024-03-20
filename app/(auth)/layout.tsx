const AuthLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      <h1>I am Auth LayOut</h1>
      {children}
    </div>
  );
}

export default AuthLayout
