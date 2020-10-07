declare module "*.png";
declare module "*.jpg";

// Generic CSS import definition
declare module "*.css" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module "react-leaflet-markercluster";
