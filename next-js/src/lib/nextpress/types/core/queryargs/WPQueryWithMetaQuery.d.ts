type _FormatWPQueryWithMetaQuery<T> = {
    [K in keyof T]: T[K];
} & {};

type WPQueryWithMetaQuery<TBase, TMeta extends readonly any[] | undefined> = _FormatWPQueryWithMetaQuery<
    TBase & {
        [K in NonNullable<TMeta>[number]['as']]: string;
    }
>;

