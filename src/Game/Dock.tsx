// import * as React from "react";
// import { Card } from "Game/Types";
// import { PlayingCard } from "Game/PlayingCard";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "store/store";
// import { NULL_HELD_INDEX, setDropSlotIndex } from "store/cardManagementSlice";
// import { DropSlot } from "components/DropSlot";
// import { cardHeight, cardWidth } from "Constants";

// const paddedWidth = cardWidth + 10;

// type DockProps = {
//   cards: Card[];
//   onDrop: (index: number) => void;
//   buttons: React.ReactNode;
// };

// export const Dock = (props: DockProps) => {
//   const dispatch = useDispatch();
//   const selfRef = React.useRef<HTMLDivElement>(null);
//   const heldIndex = useSelector(
//     (state: RootState) => state.cardManagement.heldIndex
//   );
//   const dropSlotIndex = useSelector(
//     (state: RootState) => state.cardManagement.dropSlotIndex
//   );
//   const dropsDisabled = useSelector(
//     (state: RootState) => state.cardManagement.disabled
//   );
//   const handSize = useSelector((state: RootState) => state.game.hand.length);
//   const center = selfRef.current
//     ? selfRef.current.getBoundingClientRect().width / 2
//     : undefined;

//   const handleDrop = React.useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation();
//       if (dropSlotIndex === null) {
//         return;
//       }

//       props.onDrop(dropSlotIndex);
//     },
//     [dropSlotIndex, props]
//   );

//   const handleMouseExit = React.useCallback(
//     (e: React.MouseEvent) => {
//       dispatch(setDropSlotIndex(null));
//     },
//     [dispatch]
//   );

//   const handleMouseMove = React.useCallback(
//     (e: React.MouseEvent) => {
//       dispatch(setDropSlotIndex(handSize));
//       e.stopPropagation();
//     },
//     [dispatch, handSize]
//   );

//   const playingCards = React.useMemo(() => {
//     const cards: (JSX.Element | null)[] = [];

//     if (!center) {
//       return cards;
//     }

//     for (let i = 0; i < props.cards.length; i++) {
//       const card = props.cards[i];
//       if (i === heldIndex) {
//         // cards.push(null);
//         continue;
//       }

//       const x =
//         center - paddedWidth * (props.cards.length / 2) + i * paddedWidth;

//       cards.push(
//         <PlayingCard
//           isHeld={false}
//           index={i}
//           card={card}
//           hasShadow
//           targetX={x}
//           targetY={0}
//           key={card.type + "-" + card.deck}
//         />
//       );
//     }

//     if (dropSlotIndex === handSize && heldIndex !== NULL_HELD_INDEX) {
//       cards.push(<DropSlot key="drop-slot" />);
//     }

//     return cards;
//   }, [center, dropSlotIndex, handSize, heldIndex, props.cards]);

//   return (
//     <div
//       onMouseLeave={handleMouseExit}
//       onMouseUp={handleDrop}
//       className="flex flex-col items-center justify-center select-none"
//       ref={selfRef}
//     >
//       <div className="w-[1100px]">
//         {props.buttons}

//         <div className="py-6 px-5 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 drop-shadow-lg">
//           <div
//             className={`grid grid-cols-8 grid-rows-2 gap-2 ${
//               heldIndex !== NULL_HELD_INDEX ? "cursor-pointer" : ""
//             } ${dropsDisabled ? "pointer-events-none" : ""}}`}
//             onMouseMove={handleMouseMove}
//             style={{ height: cardHeight }}
//           >
//             {playingCards}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export const asdf = () => <></>;
