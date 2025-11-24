import CortiDictation from "./CortiDictation.js";

if (!customElements.get("corti-dictation")) {
  customElements.define("corti-dictation", CortiDictation);
}

export default CortiDictation;
