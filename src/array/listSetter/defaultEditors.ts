import EditorSelect from "./../../select"
import EditorInputNumber from "./../../inputNumber"
import EditorSwitch from "./../../switch"
import EditorTextInput from "./../../textInput"
import EditorTextArea from "./../../textArea"
import EditorRadio from "./../../radio"
import EditorSlider from "./../../slider"
import Expression from './../../expression'

import { typeCheck } from "./../../utils"

const PcEditorMap: any = {
  RADIO: EditorRadio,
  SELECT: EditorSelect,
  SWITCH: EditorSwitch,
  TEXTAREA: EditorTextArea,
  TEXTINPUT: EditorTextInput,
  INPUTNUMBER: EditorInputNumber,
  SLIDER: EditorSlider,
  EXPRESSION: Expression,
};

export default function PcEditor(props: any): any {
  const { editConfig } = props

  let editor
  try {
    editor = PcEditorMap[editConfig.type.toUpperCase()] || editConfig.render
  } catch (err) {
    console.error(err)
  }

  if (typeCheck(editor, "function")) {
    return editor(props)
  }

  if (typeCheck(editor, "object") && typeCheck(editor.render, "function")) {
    return editor
  }

  return
}