package com.symbiote.backend.service;

public final class LevelCalculator {
    private LevelCalculator() {}

    public static int levelForXp(long xp) {
        return Math.max(1, (int) Math.floor(Math.sqrt(xp / 100.0)));
    }
}
