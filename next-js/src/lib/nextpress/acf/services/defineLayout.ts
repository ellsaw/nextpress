export default function defineLayout<const T extends NextpressLayout>(layout: T): T {
    return layout;
}
