import pytest

def test_word_group_listing(client, session, sample_words, sample_groups):
    """Test word group listing"""
    word = sample_words[0]
    group = sample_groups[0]

    # Add word to group
    word.groups.append(group)
    session.commit()

    # Test getting word groups
    response = client.get(f'/api/words/{word.id}/groups')
    assert response.status_code == 200
    assert len(response.json['data']['word_groups']) > 0

    # Verify group data
    group_data = response.json['data']['word_groups'][0]
    assert group_data['id'] == group.id
    assert group_data['name'] == group.name
    assert 'total_words' in group_data

def test_word_listing_filters(client, sample_words):
    """Test word listing with filters"""
    response = client.get('/api/words')
    assert response.status_code == 200
    assert 'words' in response.json['data']

def test_word_details(client, sample_words):
    """Test getting word details"""
    word = sample_words[0]
    response = client.get(f'/api/words/{word.id}')
    assert response.status_code == 200
    assert response.json['data']['nepali_word'] == word.nepali_word