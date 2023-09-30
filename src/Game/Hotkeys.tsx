import { Button } from "components/Button";
import { Modal } from "components/Modal";
import React from "react";

type HotkeyBoxProps = {
  button: string;
  description: string;
  shift?: boolean;
};

const HotkeyBox = (props: HotkeyBoxProps) => {
  return (
    <div className="flex flex-row space-x-3 w-max">
      <div className="flex flex-row space-x-1 w-32">
        {props.shift && (
          <div className="px-2 text-lg font-bold font-mono text-gray-600 dark:text-white rounded text-center bg-gray-200 dark:bg-gray-600">
            Shift
          </div>
        )}
        {props.shift && <div className="text-lg font-bold font-mono">+</div>}
        <div className="px-2 text-lg font-bold font-mono text-gray-600 dark:text-white rounded text-center bg-gray-200 dark:bg-gray-600">
          {props.button}
        </div>
      </div>

      <div>{props.description}</div>
    </div>
  );
};

type HotkeysProps = {
  shown: boolean;
  onClose: () => void;
};

export const Hotkeys = (props: HotkeysProps) => {
  return (
    <Modal shown={props.shown} onClose={props.onClose}>
      <div className="flex flex-col px-8 py-6 space-y-2">
        <div className="text-xl font-semibold mb-4">Hotkeys</div>

        <HotkeyBox button="D" description="Pick up from deck" />
        <HotkeyBox button="P" description="Pick up or drop pile" />
        <HotkeyBox button="S" description="Sort hand" />
        <HotkeyBox button="E" description="End turn" />
        <HotkeyBox button="G" description="Go out" />
        <HotkeyBox button="Esc" description="Drop card" />
        <HotkeyBox button="1-9" description="Pick up/drop 0-9" />
        <HotkeyBox shift button="1-9" description="Pick up/drop 10-19" />
      </div>
    </Modal>
  );
};

export const HotkeysButton = () => {
  const [hotkeysShown, setHotkeysShown] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setHotkeysShown(!hotkeysShown)}
        type="secondary"
        text={
          <svg
            width="24px"
            stroke-width="1.5"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-gray-600 dark:stroke-white"
          >
            <path
              d="M4 19V5a2 2 0 012-2h13.4a.6.6 0 01.6.6v13.114M6 17h14M6 21h14"
              stroke-width="1.5"
              stroke-linecap="round"
            ></path>
            <path
              d="M6 21a2 2 0 110-4"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path d="M9 7h6" stroke-width="1.5" stroke-linecap="round"></path>
          </svg>
        }
      />
      <Hotkeys shown={hotkeysShown} onClose={() => setHotkeysShown(false)} />
    </>
  );
};
