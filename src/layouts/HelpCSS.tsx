function Grid({
  area,
  className,
  children,
}: {
  area?: string;
  className?: string;
  children: any;
}) {
  return (
    <div className={className} style={area ? { gridArea: area } : undefined}>
      {children}
    </div>
  );
}

export { Grid }