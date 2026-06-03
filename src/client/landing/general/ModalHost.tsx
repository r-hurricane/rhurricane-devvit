/*!
 * Creates a modal.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {createPortal} from "react-dom";
import {useLandingContext} from "../LandingContext";

export const ModalHost = () => {
    const {modal} = useLandingContext();
    return modal
        ? createPortal(modal, document.getElementById('modal-root')!)
        : null;
};