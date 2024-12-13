<script lang="ts">
import meals from "../test-meals.json";
</script>

<div>Meal List</div>
{#each meals as meal}
  <div>{meal.name}</div>
{/each}
