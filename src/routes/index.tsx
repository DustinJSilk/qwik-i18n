import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {} from "@angular/localize/init";

export default component$(() => {
  return (
    <div>
      <h1>{$localize`Welcome to Qwik`}</h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
