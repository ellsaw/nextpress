import Button from "./button";
import { getNextPageButtons, getPreviousPageButtons } from "./helpers";

type Props = {
    page: number,
    availablePages: number
}

export default async function PaginationControls({ page, availablePages }: Props) {
    const previousPage = page !== 1 && page - 1;
    const nextPage = page !== availablePages && page + 1;

    const pageButtonsPrevious = getPreviousPageButtons(page);
    const pageButtonsNext = getNextPageButtons(page, availablePages);

    return(
        <nav className="flex flex-col mx-auto sm:max-w-96" aria-label={config.ariaLabel}>
            <div className="flex justify-between">
                {previousPage && <Button className="hidden sm:block" text={config.previousButtonText} destinationPage={previousPage}/>}
                {pageButtonsPrevious.map((pageButton, index) => (
                    <Button key={`${index}-${pageButton.text}`} text={pageButton.text} destinationPage={pageButton.page}/>
                ))}
                <p className="font-bold px-4">{page}</p>
                {pageButtonsNext.map((pageButton, index) => (
                    <Button key={`${index}-${pageButton.text}`} text={pageButton.text} destinationPage={pageButton.page}/>
                ))}
                {nextPage && <Button className="hidden sm:block" text={config.nextButtonText} destinationPage={nextPage}/>}
            </div>
            <div className="flex sm:hidden justify-between">
                {previousPage && <Button className="py-2" text={config.previousButtonText} destinationPage={previousPage}/>}
                {nextPage && <Button className="py-2" text={config.nextButtonText} destinationPage={nextPage}/>}
            </div>
        </nav>
    )
}

export const config = {
    ariaLabel: 'Pagination Controls',
    previousButtonText: '« Previous',
    nextButtonText: 'Next »',
    midSize: 2,
}
