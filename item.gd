extends Area2D

var item_type = "coin"
var bob_offset = 0.0
var player_in_range = false

func setup(itype):
	item_type = itype
	draw_item()
	$Collision.shape = CircleShape2D.new()
	$Collision.shape.radius = 12
	area_entered.connect(_on_area_entered)
	area_exited.connect(_on_area_exited)

func _process(delta):
	bob_offset += delta * 4
	$Sprite.position.y = sin(bob_offset) * 3
	
	if player_in_range and Input.is_action_just_pressed("interact"):
		pickup()

func _on_area_entered(area):
	if area.name == "Player":
		player_in_range = true

func _on_area_exited(area):
	if area.name == "Player":
		player_in_range = false

func pickup():
	match item_type:
		"coin":
			GameData.heal(5)
		"potion":
			GameData.heal(30)
		"weapon":
			GameData.next_weapon()
		"armor":
			GameData.next_armor()
		"exp":
			GameData.add_exp(30)
	queue_free()

func draw_item():
	var img = Image.create(20, 20, false, Image.FORMAT_RGBA8)
	img.fill(Color(0,0,0,0))
	
	match item_type:
		"coin":
			for x in range(5, 15):
				for y in range(6, 14):
					img.set_pixel(x, y, Color("FFD700"))
			img.set_pixel(9, 9, Color("FFA500"))
			img.set_pixel(10, 9, Color("FFA500"))
			$Label.text = "金币"
		"potion":
			for x in range(6, 14):
				for y in range(4, 16):
					img.set_pixel(x, y, Color("FF4444"))
			img.set_pixel(9, 6, Color(1,1,1,0.5))
			$Label.text = "药水"
		"weapon":
			for y in range(6, 14):
				img.set_pixel(9, y, Color("888888"))
				img.set_pixel(10, y, Color("888888"))
			$Label.text = "武器"
		"armor":
			for x in range(6, 14):
				for y in range(6, 14):
					img.set_pixel(x, y, Color("666666"))
			$Label.text = "护甲"
		"exp":
			for x in range(8, 12):
				for y in range(8, 12):
					img.set_pixel(x, y, Color("00FF00"))
			$Label.text = "经验"
	
	$Sprite.texture = ImageTexture.create_from_image(img)
