extends CharacterBody2D

var hp = 30
var max_hp = 30
var atk = 10
var speed = 40
var exp_give = 10
var type = "slime"
var target_node = null
var dead = false

var frame = 0
var frame_timer = 0.0

func setup(new_type, wave):
	type = new_type
	match type:
		"slime":
			hp = 20 + wave * 5
			atk = 5 + wave * 2
			speed = 30 + wave * 3
			exp_give = 10
		"goblin":
			hp = 30 + wave * 8
			atk = 8 + wave * 3
			speed = 45 + wave * 4
			exp_give = 15
		"boss":
			hp = 300 + wave * 100
			atk = 25 + wave * 10
			speed = 50
			exp_give = 100
	max_hp = hp
	draw_enemy()

func _physics_process(delta):
	if dead or target_node == null:
		velocity = Vector2.ZERO
		return
	
	var dir = (target_node.position - position).normalized()
	var dist = position.distance_to(target_node.position)
	
	if dist > 35:
		velocity = dir * speed
		move_and_slide()
		frame_timer += delta
		if frame_timer > 0.2:
			frame_timer = 0
			frame = (frame + 1) % 4
			draw_enemy()
	else:
		velocity = Vector2.ZERO
		attack()

func attack():
	if randf() < 0.03:
		if is_instance_valid(target_node):
			target_node.hit(atk)

func hit(damage):
	hp -= damage
	$HPBar.value = hp
	$HPBar.max_value = max_hp
	
	var flash = create_tween()
	flash.tween_property($Sprite, "modulate", Color.RED, 0.1)
	flash.tween_property($Sprite, "modulate", Color.WHITE, 0.1)
	
	if hp <= 0:
		die()

func die():
	dead = true
	GameData.add_exp(exp_give)
	queue_free()

func draw_enemy():
	var img = Image.create(32, 32, false, Image.FORMAT_RGBA8)
	img.fill(Color(0,0,0,0))
	
	var bob = 0 if frame % 2 == 0 else -2
	
	match type:
		"slime":
			for x in range(8, 24):
				for y in range(12 + bob, 24):
					img.set_pixel(x, y, Color("44AA22"))
			for x in range(10, 22):
				img.set_pixel(x, 11 + bob, Color("55BB33"))
			img.set_pixel(12, 14 + bob, Color.WHITE)
			img.set_pixel(19, 14 + bob, Color.WHITE)
			img.set_pixel(13, 15 + bob, Color.BLACK)
			img.set_pixel(18, 15 + bob, Color.BLACK)
		"goblin":
			for x in range(10, 22):
				for y in range(8 + bob, 24):
					img.set_pixel(x, y, Color("558833"))
			img.set_pixel(9, 8 + bob, Color("447722"))
			img.set_pixel(22, 8 + bob, Color("447722"))
			img.set_pixel(12, 12 + bob, Color.RED)
			img.set_pixel(19, 12 + bob, Color.RED)
			img.set_pixel(13, 15 + bob, Color("FFCC99"))
			img.set_pixel(18, 15 + bob, Color("FFCC99"))
		"boss":
			for x in range(2, 30):
				for y in range(2, 30):
					img.set_pixel(x, y, Color("880000"))
			for x in range(8, 24):
				img.set_pixel(x, 8, Color.YELLOW)
				img.set_pixel(x, 9, Color.YELLOW)
			img.set_pixel(6, 12, Color.RED)
			img.set_pixel(25, 12, Color.RED)
			for x in range(4, 28):
				img.set_pixel(x, 22, Color("440000"))
	
	$Sprite.texture = ImageTexture.create_from_image(img)
