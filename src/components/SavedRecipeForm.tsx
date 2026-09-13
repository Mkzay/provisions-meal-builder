"use client";

import { AddSupplyInput, CreateSavedRecipeInput, Ingredient, MealType } from "@/lib/types";
import React, { useMemo, useState } from "react";

const ALL_MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

interface SavedRecipeFormProps {
  ingredients: Ingredient[];
  owner: string;
  onAddSupply: (input: AddSupplyInput) => Promise<void>;
  onSubmit: (input: CreateSavedRecipeInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const SavedRecipeForm: React.FC<SavedRecipeFormProps> = ({
  ingredients,
  owner,
  onAddSupply,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [name, setName] = useState("");
  const [mealTypes, setMealTypes] = useState<MealType[]>(["Lunch", "Dinner"]);
  const [mainId, setMainId] = useState("");
  const [proteinId, setProteinId] = useState("");
  const [supplementaryId, setSupplementaryId] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [creatingRole, setCreatingRole] = useState<"Main" | "Protein" | "Supplementary" | null>(null);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false);

  const mains = useMemo(() => ingredients.filter((i) => i.role === "Main"), [ingredients]);
  const proteins = useMemo(() => ingredients.filter((i) => i.role === "Protein"), [ingredients]);
  const sides = useMemo(() => ingredients.filter((i) => i.role === "Supplementary"), [ingredients]);

  const toggleMealType = (mt: MealType) => {
    if (mealTypes.includes(mt)) {
      if (mealTypes.length > 1) setMealTypes(mealTypes.filter((t) => t !== mt));
    } else {
      setMealTypes([...mealTypes, mt]);
    }
  };

  const handleInlineCreate = async () => {
    if (!newIngredientName.trim() || !creatingRole || isCreatingIngredient) return;
    setIsCreatingIngredient(true);
    const itemName = newIngredientName.trim();
    try {
      await onAddSupply({
        name: itemName,
        role: creatingRole,
        mealTypes,
        owner,
        kind: "ingredient",
      });
      const match = ingredients.find(
        (i) => i.name.toLowerCase() === itemName.toLowerCase() && i.role === creatingRole
      );
      if (match) {
        if (creatingRole === "Main") setMainId(match.id);
        else if (creatingRole === "Protein") setProteinId(match.id);
        else if (creatingRole === "Supplementary") setSupplementaryId(match.id);
      }
      setNewIngredientName("");
      setCreatingRole(null);
    } catch (err) {
      console.error("Failed to add ingredient inline:", err);
    } finally {
      setIsCreatingIngredient(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mainId || isSubmitting) return;
    await onSubmit({
      name: name.trim(),
      mealTypes,
      mainIngredientId: mainId,
      proteinId: proteinId || undefined,
      supplementaryId: supplementaryId || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      owner,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
          Recipe Name *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Auntie Lola's Fried Rice"
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 bg-stone-50 focus:bg-white focus:outline-none shadow-brutal-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
          Suitable Meal Times *
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_MEAL_TYPES.map((mt) => (
            <button
              key={mt}
              type="button"
              onClick={() => toggleMealType(mt)}
              className={`px-3 py-1.5 rounded-xl border-2 border-stone-900 text-xs font-black transition-all shadow-brutal-xs ${
                mealTypes.includes(mt) ? "bg-amber-300 text-stone-900" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {mt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Ingredient */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-black uppercase tracking-wider text-stone-700">
            Main / Base Ingredient *
          </label>
          <button
            type="button"
            onClick={() => setCreatingRole(creatingRole === "Main" ? null : "Main")}
            className="text-[11px] font-black text-amber-700 hover:underline"
          >
            + Add New Main
          </button>
        </div>
        {creatingRole === "Main" && (
          <div className="flex gap-2 p-2 bg-amber-50 rounded-xl border-2 border-amber-400 mb-2">
            <input
              type="text"
              placeholder="New base name..."
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs border border-stone-900 rounded-lg bg-white"
            />
            <button
              type="button"
              disabled={isCreatingIngredient || !newIngredientName.trim()}
              onClick={handleInlineCreate}
              className="px-3 py-1 bg-amber-300 border border-stone-900 rounded-lg text-xs font-black shadow-brutal-xs"
            >
              {isCreatingIngredient ? "Adding..." : "Add"}
            </button>
          </div>
        )}
        <select
          required
          value={mainId}
          onChange={(e) => setMainId(e.target.value)}
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 bg-stone-50 focus:bg-white focus:outline-none shadow-brutal-xs"
        >
          <option value="">Select Main Ingredient...</option>
          {mains.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} {m.available ? "• in stock" : "(out of stock)"}
            </option>
          ))}
        </select>
      </div>

      {/* Protein */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-black uppercase tracking-wider text-stone-700">
            Protein (Optional)
          </label>
          <button
            type="button"
            onClick={() => setCreatingRole(creatingRole === "Protein" ? null : "Protein")}
            className="text-[11px] font-black text-amber-700 hover:underline"
          >
            + Add New Protein
          </button>
        </div>
        {creatingRole === "Protein" && (
          <div className="flex gap-2 p-2 bg-amber-50 rounded-xl border-2 border-amber-400 mb-2">
            <input
              type="text"
              placeholder="New protein name..."
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs border border-stone-900 rounded-lg bg-white"
            />
            <button
              type="button"
              disabled={isCreatingIngredient || !newIngredientName.trim()}
              onClick={handleInlineCreate}
              className="px-3 py-1 bg-amber-300 border border-stone-900 rounded-lg text-xs font-black shadow-brutal-xs"
            >
              {isCreatingIngredient ? "Adding..." : "Add"}
            </button>
          </div>
        )}
        <select
          value={proteinId}
          onChange={(e) => setProteinId(e.target.value)}
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 bg-stone-50 focus:bg-white focus:outline-none shadow-brutal-xs"
        >
          <option value="">(None)</option>
          {proteins.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} {p.available ? "• in stock" : "(out of stock)"}
            </option>
          ))}
        </select>
      </div>

      {/* Supplementary */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-black uppercase tracking-wider text-stone-700">
            Side / Supplementary (Optional)
          </label>
          <button
            type="button"
            onClick={() => setCreatingRole(creatingRole === "Supplementary" ? null : "Supplementary")}
            className="text-[11px] font-black text-amber-700 hover:underline"
          >
            + Add New Side
          </button>
        </div>
        {creatingRole === "Supplementary" && (
          <div className="flex gap-2 p-2 bg-amber-50 rounded-xl border-2 border-amber-400 mb-2">
            <input
              type="text"
              placeholder="New side dish name..."
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs border border-stone-900 rounded-lg bg-white"
            />
            <button
              type="button"
              disabled={isCreatingIngredient || !newIngredientName.trim()}
              onClick={handleInlineCreate}
              className="px-3 py-1 bg-amber-300 border border-stone-900 rounded-lg text-xs font-black shadow-brutal-xs"
            >
              {isCreatingIngredient ? "Adding..." : "Add"}
            </button>
          </div>
        )}
        <select
          value={supplementaryId}
          onChange={(e) => setSupplementaryId(e.target.value)}
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 bg-stone-50 focus:bg-white focus:outline-none shadow-brutal-xs"
        >
          <option value="">(None)</option>
          {sides.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} {s.available ? "• in stock" : "(out of stock)"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
          Source URL (Optional reference link)
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://example.com/recipe"
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 bg-stone-50 focus:bg-white focus:outline-none shadow-brutal-xs"
        />
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border-2 border-stone-900 bg-stone-100 hover:bg-stone-200 text-xs font-black text-stone-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !mainId}
          className="px-5 py-2 rounded-xl border-2 border-stone-900 bg-emerald-300 hover:bg-emerald-400 text-stone-900 text-xs font-black shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save to My Recipes"}
        </button>
      </div>
    </form>
  );
};
