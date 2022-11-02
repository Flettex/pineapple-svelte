<script lang="ts">
  import { Transition, Dialog, TransitionChild, DialogOverlay } from "@rgossiaux/svelte-headlessui";

  export let isOpen: boolean;
</script>

<Transition show={isOpen}>
    <Dialog on:close={() => isOpen = false}>
      <div class="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center">
        <div
          class="block items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0"
        >
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-75"
            leave="ease-in duration-200"
            leaveFrom="opacity-75"
            leaveTo="opacity-0"
            entered="opacity-75"
          >
            <DialogOverlay class="fixed inset-0 bg-gray-500 transition-opacity" />
          </TransitionChild>
  
          <TransitionChild
            enter="ease-out transform duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in transform duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <!-- This element is to trick the browser into centering the modal contents. -->
            <!-- Keep this empty because this has no use other than centering the modal -->
            <!-- Comment this out for now... -->
            <!-- <div
              class="inline-block align-middle h-[35vh] sm:h-screen"
              aria-hidden="true"
            >
            </div> -->

            <div
              class="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <slot />
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>