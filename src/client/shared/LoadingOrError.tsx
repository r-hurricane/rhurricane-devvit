/*!
 * A common loading screen.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export interface LoadingOrErrorProps {
    message?: string;
    error?: boolean | undefined;
    errorMessage?: string | undefined;
}

export const LoadingOrError = ({message, error, errorMessage}: LoadingOrErrorProps) => {
    return (
        <div className="absolute top-0 left-0 z-20 w-full h-full flex flex-col justify-center items-center gap-2">
            <img
                src={!error && !errorMessage ? "loading.gif" : "error.png"}
                title="Loading..."
                alt="Loading Icon"
                height="170px"
                width="170px"
            />
            <div className="text-lg font-bold text-center">
                {!error && !errorMessage
                    ? (message ?? 'Loading...')
                    : (errorMessage ?? 'Sorry, there was an error loading... Please check back soon!')
                }
            </div>
        </div>
    );
};