type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

declare module "*.module.pcss" {
  const classes: CSSModuleClasses;
  export default classes;
}

interface CommonReactProps {
  className?: string;
  style?: React.CSSProperties;
}
