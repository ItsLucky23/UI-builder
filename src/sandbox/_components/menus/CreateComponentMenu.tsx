import { motion, AnimatePresence } from "framer-motion";
import { useMenuStates } from "../../_providers/MenuStatesProvider"

export default function CreateComponentMenu() {

  const { createComponentMenuOpen, mousePositionCreateComponentMenu } = useMenuStates();

  const menuPosition = {
    x: mousePositionCreateComponentMenu ? mousePositionCreateComponentMenu.x : 0,
    y: mousePositionCreateComponentMenu ? mousePositionCreateComponentMenu.y : 0,
  }

  return (
    // <></>
    <AnimatePresence>
      {createComponentMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            zIndex: 1000,
          }}
        >
          <div 
            className="bg-red-500 rounded p-4 flex flex-col gap-2"
            style={{
              position: "absolute",
              left: menuPosition.x,
              top: menuPosition.y,
              // transform: 'translate(-50%, -50%)',
              transform: 'translate(20px, calc(-100px + -50%))',
            }}
            id="createComponentMenu"
          >
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
    
}