package com.symbiote.backend.service;

import com.symbiote.backend.entity.LedgerTransaction;
import com.symbiote.backend.repository.LedgerTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LedgerTransactionRepositoryAdapter {
    private final LedgerTransactionRepository repository;

    public void record(Long userId, String type, long amount, String currency, String metaJson) {
        LedgerTransaction tx = LedgerTransaction.builder()
                .txId(UUID.randomUUID())
                .userId(userId)
                .type(type)
                .amount(amount)
                .currency(currency)
                .meta(metaJson)
                .createdAt(Instant.now())
                .build();
        repository.save(tx);
    }
}
