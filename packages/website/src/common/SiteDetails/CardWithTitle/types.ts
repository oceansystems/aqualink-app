import { TypographyProps } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

export interface Value {
  text: string;
  variant: TypographyProps["variant"];
  marginRight: CSSProperties["marginRight"];
  overflowEllipsis?: boolean;
}
