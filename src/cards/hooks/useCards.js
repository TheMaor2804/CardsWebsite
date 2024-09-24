import { useCallback, useEffect, useState } from "react";
import { useSnack } from "../../providers/SnackbarProvider";
import axios from "axios";
import useAxios from "../../hooks/useAxios";
import { useCurrentUser } from "../../users/providers/UserProvider";
import { useSearchParams } from "react-router-dom";
import { changeLikeStatus, createCardApi, deleteCard, editCard, getCard, getCards, getMyCardsApi } from "../services/cardsApiService";

export default function useCards() {
  const [cards, setCards] = useState();
  const [card, setCard] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [query, setQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState();
  const [searchParams] = useSearchParams();

  const { user } = useCurrentUser();

  const setSnack = useSnack();

  useAxios();

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    if (cards) {
      setFilteredCards(
        cards.filter((card) =>
          card.title.includes(query) || String(card.bizNumber).includes(query)
        )
      );
    }
    setIsLoading(false);
  }, [cards, query]);

  const getAllCards = useCallback(async () => {
    setIsLoading(true);
    try {
      const cards = await getCards();
      setCards(cards);
      setSnack("success", "All cards are here!");
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  const getCardById = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const card = await getCard(id);
      setCard(card);
      setSnack("success", "Card is here!");
      setIsLoading(false);
      return card;
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  const getMyCards = useCallback(async () => {
    setIsLoading(true);
    try {
      const myCards = await getMyCardsApi();
      setCards(myCards);
      setSnack("success", "All your cards are here!");
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  const getFavCards = useCallback(async () => {
    setIsLoading(true);
    try {
      const cards = await getCards();
      const favCards = cards.filter((card) => card.likes.includes(user._id));
      setCards(favCards);
      setSnack("success", "All your favorite cards are here!");
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [user]);

  const createCard = useCallback(async (card) => {
    try {
      const data = await createCardApi(card);
      setSnack("success", "Card created!");
      return data;
    } catch (err) {
      setError(err.message);
    }
  });

  const handleEdit = useCallback(async (id, card) => {
    try {
      const data = await editCard(id, card);
      setSnack("success", "Card updated!");
      return data;
    } catch (err) {
      setError(err.message);
    }
  });

  const handleLike = useCallback(async (id) => {
    try {
      const data = await changeLikeStatus(id);
      return data;
    } catch (err) {
      setError(err.message);
    }
  });

  const handleDelete = useCallback(async (id) => {
    try {
      const data = await deleteCard(id);
      setSnack("success", "Card deleted!");
      return data;
    } catch (err) {
      setError(err.message);
    }
  });


  return {
    cards,
    card,
    error,
    isLoading,
    filteredCards,
    setIsLoading,
    getAllCards,
    getCardById,
    getMyCards,
    getFavCards,
    handleDelete,
    handleLike,
    handleEdit,
    createCard,
  };
}
